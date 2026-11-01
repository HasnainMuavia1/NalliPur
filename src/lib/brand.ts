// Contact details and menu are transcribed from Nalli Pur's own Instagram
// (@nallipurbiryanipulao): profile bio, post captions and the menu carousel.
// Prices are in PKR as published there; they can change.

export const PHONE_DISPLAY = "0305-9555838";
export const PHONE_TEL = "tel:+923059555838";
export const WHATSAPP = "https://wa.me/923059555838";
export const INSTAGRAM = "https://www.instagram.com/nallipurbiryanipulao/";

export const BRANCHES = [
  {
    name: "Branch 1 — PIA Road",
    address: "1-A1 PIA Road, Main Boulevard, Johar Town, Lahore",
    maps: "https://www.google.com/maps/search/?api=1&query=Nalli+Pur+Biryani+%26+Pulao+1-A1+PIA+Road+Main+Boulevard+Johar+Town+Lahore",
  },
  {
    name: "Branch 2 — Lakshmi Chowk",
    address: "Lakshmi Chowk, Lahore",
    maps: "https://www.google.com/maps/search/?api=1&query=Nalli+Pur+Biryani+%26+Pulao+Lakshmi+Chowk+Lahore",
  },
] as const;

export type Price = string | null;
export type MenuRow = { name: string; note?: string; prices: Price[] };
export type MenuTable = { title: string; subtitle?: string; columns: string[]; rows: MenuRow[] };
export type MenuCategory = { id: string; label: string; tables: MenuTable[]; footnote?: string };

const r = (name: string, ...prices: (number | string | null)[]): MenuRow => ({
  name,
  prices: prices.map((p) => (p === null ? null : String(p))),
});
const rn = (name: string, note: string, ...prices: (number | string | null)[]): MenuRow => ({
  ...r(name, ...prices),
  note,
});

export const MENU: MenuCategory[] = [
  {
    id: "nalli",
    label: "Biryani & Pulao",
    tables: [
      {
        title: "Authentic Karachi Nalli Biryani & Pulao",
        subtitle: "Asli tay nasli",
        columns: ["Single", "Double", "1 KG"],
        rows: [
          rn("Special Nalli Biryani", "Thaal, serves 1", 1360, null, null),
          rn("Special Nalli Pulao", "Thaal, serves 1", 1360, null, null),
          r("Beef Biryani", 540, 820, 1300),
          r("Beef Pulao", 540, 820, 1300),
          r("Chicken Biryani", 450, 650, 1180),
          r("Chicken Pulao", 450, 650, 1180),
          r("Sada Biryani", 280, 420, 680),
          r("Sada Pulao", 280, 420, 680),
          r("Shami Biryani", 360, 560, null),
          r("Shami Pulao", 360, 560, null),
          r("Special Zarda / Mutanjan", 220, 440, null),
        ],
      },
      {
        title: "Add-ons",
        columns: ["Price"],
        rows: [
          r("Nalli per piece", 540),
          r("Extra piece beef", 280),
          r("Extra piece chicken", 200),
          r("Shami kabab", 80),
        ],
      },
    ],
    footnote: "Single and Double serve 1; 1 KG serves 2.",
  },
  {
    id: "bbq-rice",
    label: "BBQ Biryani & Pulao",
    tables: [
      {
        title: "Nallipur's BBQ Biryani & Pulao",
        columns: ["Leg", "Chest"],
        rows: [
          r("Chicken Tikka Biryani", 720, 760),
          r("Chicken Tikka Pulao", 720, 760),
          r("Chicken Malai Tikka Biryani", 740, 780),
          r("Chicken Malai Tikka Pulao", 740, 780),
          r("Chicken Afghani Tikka Biryani", 740, 780),
          r("Chicken Afghani Tikka Pulao", 740, 780),
        ],
      },
      {
        title: "Boti Biryani & Pulao",
        columns: ["Price"],
        rows: [
          r("Chicken Tikka Boti Biryani", 740),
          r("Chicken Tikka Boti Pulao", 740),
          r("Chicken Malai Boti Biryani", 760),
          r("Chicken Malai Boti Pulao", 760),
          r("Chicken Bihari Boti Biryani", 760),
          r("Chicken Bihari Boti Pulao", 760),
        ],
      },
    ],
  },
  {
    id: "bbq",
    label: "Karachi BBQ",
    tables: [
      {
        title: "Chicken Tikka Piece",
        columns: ["Leg", "Chest"],
        rows: [
          rn("Chicken Behari Tikka Piece", "House special", 540, 580),
          rn("Chicken Tikka Piece", "Red tikka", 520, 560),
          r("Chicken Malai Tikka Piece", 540, 580),
          r("Chicken Green Tikka Piece", 540, 580),
          r("Chicken Afghani Tikka", 540, 580),
        ],
      },
      {
        title: "Chicken BBQ (Boneless)",
        columns: ["Half", "Full"],
        rows: [
          r("Chicken Tikka Boti", 940, 1880),
          r("Chicken Bihari Boti", 980, 1960),
          r("Chicken Malai Boti", 980, 1960),
          r("Malai Cheese Boti", 1180, 2360),
          r("Chicken Green Boti", 980, 1960),
        ],
      },
      {
        title: "Chicken Kababs",
        columns: ["Half", "Full"],
        rows: [
          r("Chicken Reshmi Kabab", 920, 1840),
          r("Chicken Cheese Kabab", 1120, 2240),
          r("Chicken Lebonani Kabab", 1120, 2240),
        ],
      },
      {
        title: "Special Beef Bihari BBQ",
        subtitle: "Highlight of Karachi",
        columns: ["Half", "Full"],
        rows: [
          r("Special Beef Behari Boti", 1180, 2360),
          rn("Special Beef Behari Kebab", "Pasanday style", 1180, 2360),
          r("Beef Dhaga Kebab", 1080, 2160),
          r("Beef Gola Kebab", 1080, 2160),
          r("Chandan Kebab", 980, 1960),
          r("Chandan Cheese Kabab", 1180, 2360),
          r("Beef Seekh Kebab", 980, 1960),
          r("Cheesy Beef Kabab", 1180, 2360),
        ],
      },
    ],
  },
  {
    id: "rolls",
    label: "Rolls & Tandoor",
    tables: [
      {
        title: "Puri Paratha Roll",
        subtitle: "Crispy, spicy, smoky & tangy",
        columns: ["Chatni", "Mayo Garlic", "Spicy Mayo", "Cream & Cheese"],
        rows: [
          r("Chicken Tikka Boti Roll", 420, 480, 480, 500),
          r("Chicken Behari Boti Roll", 440, 500, 500, 520),
          r("Chicken Malai Boti Roll", 440, 500, 500, 520),
          r("Chicken Reshmi Kabab Roll", 440, 500, 500, 520),
          r("Chicken Dhaga Kabab Roll", 440, 500, 500, 520),
          r("Chicken Kabab Roll", 440, 500, 500, 520),
          r("Beef Behari Boti Roll", 520, 580, 580, 600),
          r("Beef Behari Kabab Roll", 520, 580, 580, 600),
          r("Beef Dhaga Kabab Roll", 440, 500, 500, 520),
          r("Beef Seekh Kabab Roll", 440, 500, 500, 520),
        ],
      },
      {
        title: "Tandoor",
        columns: ["Price"],
        rows: [
          r("Zeera Dhanya Roti", 60),
          r("Farmaish Chapati", 60),
          r("Milky Naan", 100),
          r("Roghni Naan", 150),
          r("Kilwanji Naan", 150),
          r("Garlic Naan", 150),
          r("Cheese Naan", 500),
          r("Special Puri Paratha", 150),
        ],
      },
    ],
    footnote: "Extra 260 for a jumbo roll.",
  },
  {
    id: "sides",
    label: "Sides & Sweets",
    tables: [
      {
        title: "Sides / Extras",
        columns: ["Price"],
        rows: [
          r("Khoya Kheer", 240),
          r("Mutanjan", "220 / 440"),
          r("Salad", 120),
          r("Raita", 120),
          r("Beef Shami Kabab", 80),
          r("Extra Packing Dine In", 30),
        ],
      },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    tables: [
      {
        title: "Mocktails",
        columns: ["Price"],
        rows: [
          r("Mint Margarita", 275),
          r("Fresh Lime", 275),
          r("Lemonade", 275),
          r("Blueberry Lemonade", 420),
          r("Strawberry Chiller", 320),
          r("Tropical Chiller", 375),
          r("Pina Colada", 420),
          r("Blue Colada", 460),
          r("Strawberry Mojito", 275),
          r("Lime & Mint Mojito", 275),
          r("Blueberry Mojito", 275),
          r("Blue Lagoon", 350),
          r("Zeera Pani", 325),
        ],
      },
      {
        title: "Iced Drinks",
        columns: ["Price"],
        rows: [
          r("Ice Tea Peach", 360),
          r("Ice Tea Lemon", 320),
          r("Ice Tea Apple", 360),
          r("Ice Latte", 320),
          r("Ice Mocha Latte", 360),
          r("Ice Coffee", 320),
        ],
      },
      {
        title: "Hot Beverages",
        columns: ["Price"],
        rows: [
          r("Black Coffee", 250),
          r("Beater Coffee", 300),
          r("Beater Mocha Coffee", 350),
          r("Classic Hot Chocolate", 350),
          r("Regular Chai", 180),
          r("Doodh Patti", 200),
          r("Karak Chai", 180),
          r("Elaichi Chai", 200),
        ],
      },
      {
        title: "Shakes & Cold Coffee",
        columns: ["Price"],
        rows: [
          r("Classic Vanilla Shake", 475),
          r("Vanilla Oreo Shake", 520),
          r("Chocolate Classic Shake", 460),
          r("Chocolate Oreo Shake", 520),
          r("Chocolate Devil Shake", 620),
          r("Vanilla Cold Coffee", 460),
          r("Chocolate Cold Coffee", 460),
          r("Seasonal Fresh Juice", 475),
          r("Seasonal Fresh Shake", 425),
          r("Power Shake", 695),
        ],
      },
      {
        title: "Halal Beer",
        columns: ["Price"],
        rows: [
          r("Lemon Spark Beer", 360),
          r("Heaven Beer", 360),
          r("Peach Beer", 360),
          r("Double Apple Beer", 390),
        ],
      },
    ],
  },
];

export const DAIG: MenuTable = {
  title: "Mini Daig",
  columns: ["Chicken", "Beef", "Mutton"],
  rows: [
    rn("Special Sindhi Biryani", "5 to 6 persons", 3399, 4399, 5999),
    rn("Special Tikka Biryani", "5 to 6 persons", 3399, 4399, 5999),
    rn("Special White Biryani", "5 to 6 persons", 3399, 4399, 5999),
    rn("Special Yakhni Pulao", "5 to 6 persons", 3399, 4399, 5999),
    rn("Danedaar Qorma", "4 to 5 persons", 2899, 3999, 5499),
    rn("Achaar Gosht", "4 to 5 persons", 2899, 3999, 5499),
    rn("Karahi Gosht", "4 to 5 persons", 2899, 3999, 5499),
    rn("Shenwari Karahi / Namkeen Karahi", "4 to 5 persons", 2899, 3999, 5499),
  ],
};

export const DAIG_NOTES = [
  "One mini daig typically serves 5–6 people on average (exceptions may apply).",
  "Dine-in: book 1 hour before arrival and pay 50% of the bill online.",
  "Takeaway: book 1 hour in advance and pay 50% of the bill online.",
  "A security deposit of PKR 10,000 is required for takeaway daigs.",
  "Delivery (Lahore only): place your order 1 to 2 hours in advance.",
  "Delivery charges are not included in the daig price.",
];

/* Chapter 04 — the four flavors. Prices are the Single / Double / 1 KG rows above. */
export const FLAVORS = [
  {
    id: "beef-biryani",
    name: "Beef Biryani",
    from: 540,
    kicker: "Saffron · Beef · Nalli",
    body: "Saffron-streaked basmati layered with tender beef, Karachi style. Crown it with a marrow-rich nalli for the full legend.",
    prices: "Single 540 · Double 820 · 1 KG 1300",
    extra: "Nalli 540 per piece",
    image: "beef-biryani",
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    from: 450,
    kicker: "Saffron · Chicken",
    body: "The same saffron-gold rice, built around tender bone-in chicken soaked in biryani masala.",
    prices: "Single 450 · Double 650 · 1 KG 1180",
    extra: "Extra piece chicken 200",
    image: "chicken-biryani",
  },
  {
    id: "beef-pulao",
    name: "Beef Pulao",
    from: 540,
    kicker: "Yakhni · Beef · Nalli",
    body: "Basmati cooked in a deep beef yakhni — quieter in colour, richer in stock — with tender beef and the signature nalli.",
    prices: "Single 540 · Double 820 · 1 KG 1300",
    extra: "Nalli 540 per piece",
    image: "beef-pulao",
  },
  {
    id: "chicken-pulao",
    name: "Chicken Pulao",
    from: 450,
    kicker: "Yakhni · Chicken",
    body: "Gentle, fragrant yakhni rice with whole spices and tender chicken. Comfort, Karachi style.",
    prices: "Single 450 · Double 650 · 1 KG 1180",
    extra: "Extra piece chicken 200",
    image: "chicken-pulao",
  },
] as const;
