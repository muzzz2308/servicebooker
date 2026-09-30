import {
  type ReminderKind,
  sendAppointmentReminder,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { reminderWindow } from "@/lib/reminder-window";

export type ReminderFlag = "reminder24hSent" | "reminder1hSent";

type ReminderPass = {
  kind: ReminderKind;
  flag: ReminderFlag;
  centerHours: number;
};

const PASSES: ReminderPass[] = [
  { kind: "24h", flag: "reminder24hSent", centerHours: 24 },
  { kind: "1h", flag: "reminder1hSent", centerHours: 1 },
];

export async function sendDueReminders(now = new Date()) {
  const counts = { sent24h: 0, sent1h: 0, failed: 0 };

  for (const pass of PASSES) {
    const window = reminderWindow(now, pass.centerHours);
    const appointments = await prisma.appointment.findMany({
      where: {
        status: "confirmed",
        [pass.flag]: false,
        startsAt: { gte: window.gte, lte: window.lte },
      },
      select: {
        id: true,
        startsAt: true,
        client: { select: { name: true, email: true, phone: true } },
        service: { select: { name: true } },
        provider: { select: { businessName: true, timezone: true } },
      },
    });

    for (const appointment of appointments) {
      const delivered = await sendAppointmentReminder(
        {
          toEmail: appointment.client.email,
          toPhone: appointment.client.phone,
          clientName: appointment.client.name,
          businessName: appointment.provider.businessName,
          serviceName: appointment.service.name,
          timezone: appointment.provider.timezone,
          startsAt: appointment.startsAt,
        },
        pass.kind,
      );

      if (!delivered) {
        counts.failed += 1;
        continue;
      }

      const { count } = await prisma.appointment.updateMany({
        where: {
          id: appointment.id,
          status: "confirmed",
          [pass.flag]: false,
        },
        data: { [pass.flag]: true },
      });

      if (count > 0) {
        if (pass.kind === "24h") {
          counts.sent24h += 1;
        } else {
          counts.sent1h += 1;
        }
      }
    }
  }

  return counts;
}
