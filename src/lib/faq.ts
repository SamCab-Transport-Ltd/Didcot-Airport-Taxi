export interface FAQItem {
  question: string;
  answer: string;
}

export const generalFAQ: FAQItem[] = [
  {
    question: "Do I need to book in advance?",
    answer:
      "Yes — pre-booking is recommended to lock in a fixed price and ensure a vehicle is reserved for your time slot. We accept bookings up to 12 months in advance and same-day where availability allows.",
  },
  {
    question: "Is the quoted fare a fixed price?",
    answer:
      "Every quote is a guaranteed fixed price. There are no peak-time surge fees and no surprise charges if traffic is heavy — only pre-agreed extras such as additional stops or extra luggage handling.",
  },
  {
    question: "Do you track my flight if it is delayed?",
    answer:
      "Yes. Every airport pickup includes live flight tracking. We adjust your pickup time automatically if your inbound flight is early or delayed, with up to 60 minutes of free wait after landing.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept Visa, Mastercard, Amex and Apple/Google Pay online at the time of booking, plus card or cash payment direct to the driver. Corporate accounts are available with monthly invoicing.",
  },
  {
    question: "Are child seats available?",
    answer:
      "Yes — infant carriers, child seats and booster seats are available free of charge on request when booking. Please specify the child's age so we can supply the correct seat type.",
  },
  {
    question: "Can I make a return booking?",
    answer:
      "Absolutely. Select 'Return' on the booking form and we'll discount your second leg. We track your return flight and re-confirm the pickup the day before.",
  },
  {
    question: "What if I need to change or cancel my booking?",
    answer:
      "You can modify or cancel free of charge up to 12 hours before pickup. Within 12 hours a small admin fee may apply. We do not charge anything if the cancellation is due to a flight cancellation outside your control.",
  },
];
