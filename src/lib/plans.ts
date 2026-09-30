export type Plan = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  featured?: boolean;
  includesLabel: string;
  includes: string[];
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    blurb: "For independent providers getting bookings online.",
    includesLabel: "Includes",
    includes: [
      "Public booking page",
      "Unlimited appointments",
      "Services, prices, and deposits",
      "Stripe Checkout",
      "Client list and notes",
      "Email reminders",
      "Block off time",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    blurb: "For growing studios that need more control.",
    featured: true,
    includesLabel: "Everything in Starter, plus",
    includes: [
      "SMS reminders",
      "Recurring weekly bookings",
      "Custom booking URL",
      "Timezone-accurate scheduling",
      "No-show and cancellation status",
      "Priority email support",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 149,
    blurb: "For established operators who want the full stack.",
    includesLabel: "Everything in Professional, plus",
    includes: [
      "Remove ServiceBooker branding",
      "Higher booking volume",
      "Onboarding help",
      "Dedicated success contact",
    ],
  },
];
