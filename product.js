const products = [
    {
        id: 1,
        name: "Ghar Soaps Sandalwood & Saffron Magic Bar",
        category: "Beauty",
        brand: "Ghar Soaps",
        price: 368,
        rating: 4.0,
        image: "./img/ghar.png",
        description: "Sandalwood and saffron bathing soap for everyday use.",
        stock: 20,
        bestSeller: true,

        details: {
            quantity: "300 g - Pack of 3",
            type: "Bath Soap"
        },

        reviews: [
            {
                name: "Priya",
                rating: 5,
                comment: "Good fragrance and nice product."
            },
            {
                name: "Arun",
                rating: 4,
                comment: "Worth the price."
            }
        ]
    },

    {
        id: 2,
        name: "Cetaphil Gentle Skin Hydrating Face Wash",
        category: "Beauty",
        brand: "Cetaphil",
        price: 370,
        rating: 4.5,
        image: "./img/cetaphil.png",
        description: "Gentle hydrating face wash suitable for everyday cleansing.",
        stock: 25,
        bestSeller: true,

        details: {
            quantity: "118 ml",
            type: "Face Wash"
        },

        reviews: [
            {
                name: "Divya",
                rating: 5,
                comment: "Very gentle and works well for my skin."
            },
            {
                name: "Kavya",
                rating: 4,
                comment: "Good face wash for daily use."
            }
        ]
    },

    {
        id: 3,
        name: "LifeKrafts Polyester Magnetic Mosquito Net for All Door",
        category: "Home",
        brand: "LifeKrafts",
        price: 898,
        rating: 4.0,
        image: "./img/net.png",
        description: "Magnetic mosquito net designed to protect your home from mosquitoes and insects.",
        stock: 15,
        bestSeller: true,

        details: {
            material: "Polyester",
            type: "Magnetic Door Mosquito Net"
        },

        reviews: [
            {
                name: "Kumar",
                rating: 4,
                comment: "Easy to install and useful."
            },
            {
                name: "Rahul",
                rating: 4,
                comment: "Good quality mosquito net."
            }
        ]
    },

    {
        id: 4,
        name: "Lifelong PVC Hex Fixed Dumbbells Pack of 2",
        category: "Sports",
        brand: "Lifelong",
        price: 370,
        rating: 4.5,
        image: "./img/dumbells.png",
        description: "Compact PVC dumbbells suitable for home workouts and strength training.",
        stock: 18,
        bestSeller: true,

        details: {
            weight: "2 kg x 2",
            type: "Fixed Dumbbells"
        },

        reviews: [
            {
                name: "Vijay",
                rating: 5,
                comment: "Perfect for basic home workouts."
            },
            {
                name: "Ajay",
                rating: 4,
                comment: "Good product for beginners."
            }
        ]
    },

    {
        id: 5,
        name: "SOFTSPUN Microfiber Cloth - 4 pcs",
        category: "Automotive",
        brand: "SOFTSPUN",
        price: 244,
        rating: 4.0,
        image: "./img/cloth.png",
        description: "Soft microfiber cleaning cloth suitable for cars, bikes and household cleaning.",
        stock: 30,
        bestSeller: true,

        details: {
            quantity: "Pack of 4",
            size: "40 x 40 cm",
            gsm: "340 GSM",
            type: "Microfiber Cleaning Cloth"
        },

        reviews: [
            {
                name: "Suresh",
                rating: 4,
                comment: "Very soft and absorbs water well."
            },
            {
                name: "Manoj",
                rating: 4,
                comment: "Useful for cleaning my car."
            }
        ]
    },

    {
        id: 6,
        name: "boAt Airdopes 219, 4Mics ENx, 40H Battery",
        category: "Electronics",
        brand: "boAt",
        price: 999,
        rating: 4.5,
        image: "./img/BOAT.png",
        description: "Wireless earbuds with 4 microphones, ENx technology and long battery life.",
        stock: 22,
        bestSeller: true,

        details: {
            battery: "Up to 40 Hours",
            microphones: "4 Mics",
            type: "Wireless Earbuds"
        },

        reviews: [
            {
                name: "Naveen",
                rating: 5,
                comment: "Excellent sound quality for this price."
            },
            {
                name: "Hari",
                rating: 4,
                comment: "Battery backup is really good."
            }
        ]
    },

    {
        id: 7,
        name: "Mortein Advanced Anti-Mosquito Racquet",
        category: "Home",
        brand: "Mortein",
        price: 435,
        rating: 4.0,
        image: "./img/mos.png",
        description: "Electric mosquito racquet designed for quick and convenient mosquito protection.",
        stock: 16,
        bestSeller: true,

        details: {
            type: "Electric Mosquito Racquet",
            usage: "Indoor"
        },

        reviews: [
            {
                name: "Deepak",
                rating: 4,
                comment: "Works well and is easy to use."
            },
            {
                name: "Meena",
                rating: 4,
                comment: "Useful product for home."
            }
        ]
    },

    {
        id: 8,
        name: "Shining Diva Fashion 5 Pcs Heart Butterfly Pearl Necklace Jewellery Set",
        category: "Fashion",
        brand: "Shining Diva",
        price: 298,
        rating: 4.0,
        image: "./img/chain.png",
        description: "Stylish heart, butterfly and pearl necklace jewellery set for women.",
        stock: 14,
        bestSeller: true,

        details: {
            quantity: "5 Pieces",
            type: "Necklace Jewellery Set",
            style: "Heart, Butterfly & Pearl"
        },

        reviews: [
            {
                name: "Anjali",
                rating: 4,
                comment: "Looks beautiful and stylish."
            },
            {
                name: "Sneha",
                rating: 4,
                comment: "Good jewellery set for the price."
            }
        ]
    },

    {
        id: 9,
        name: "YouBella Rose Gold Plated Crystal Bracelet",
        category: "Fashion",
        brand: "YouBella",
        price: 189,
        rating: 4.2,
        image: "./img/bracelet.png",
        description: "Stylish rose gold plated crystal bracelet designed for women.",
        stock: 27,
        bestSeller: true,

        details: {
            color: "Rose Gold",
            type: "Crystal Bracelet",
            material: "Gold Plated"
        },

        reviews: [
            {
                name: "Pooja",
                rating: 5,
                comment: "Beautiful bracelet and looks premium."
            },
            {
                name: "Aishwarya",
                rating: 4,
                comment: "Nice design and comfortable to wear."
            }
        ]
    },

    {
        id: 10,
        name: "Minimalist Sunscreen SPF 50 PA++++",
        category: "Beauty",
        brand: "Minimalist",
        price: 369,
        rating: 4.8,
        image: "./img/sunscreen.png",
        description: "SPF 50 PA++++ sunscreen with niacinamide and multi-vitamins for everyday sun protection.",
        stock: 35,
        bestSeller: true,

        details: {
            spf: "SPF 50 PA++++",
            ingredient: "Niacinamide & Multi-Vitamins",
            type: "Sunscreen"
        },

        reviews: [
            {
                name: "Shalini",
                rating: 5,
                comment: "Lightweight and easy to apply."
            },
            {
                name: "Nisha",
                rating: 5,
                comment: "One of my favourite sunscreens."
            }
        ]
    },

    {
        id: 11,
        name: "The Derma Co 10% Vitamin C Face Serum",
        category: "Beauty",
        brand: "The Derma Co",
        price: 538,
        rating: 4.8,
        image: "./img/serum.png",
        description: "Vitamin C face serum with niacinamide designed for everyday skincare.",
        stock: 24,
        bestSeller: true,

        details: {
            vitaminC: "10%",
            niacinamide: "5%",
            type: "Face Serum"
        },

        reviews: [
            {
                name: "Keerthi",
                rating: 5,
                comment: "Good serum and feels lightweight."
            },
            {
                name: "Swetha",
                rating: 4,
                comment: "Nice addition to my skincare routine."
            }
        ]
    },

    {
        id: 12,
        name: "ZOUK Flap Sling Bag",
        category: "Fashion",
        brand: "ZOUK",
        price: 849,
        rating: 4.7,
        image: "./img/bag.png",
        description: "Stylish flap sling bag suitable for casual outings and everyday use.",
        stock: 12,
        bestSeller: true,

        details: {
            type: "Sling Bag",
            style: "Flap Bag",
            usage: "Casual"
        },

        reviews: [
            {
                name: "Riya",
                rating: 5,
                comment: "Very stylish and spacious."
            },
            {
                name: "Lakshmi",
                rating: 4,
                comment: "Good quality and looks beautiful."
            }
        ]
    },
    {
    id: 13,
    name: "Noise ColorFit Smart Watch",
    category: "Electronics",
    brand: "Noise",
    price: 1499,
    rating: 4.5,
    image: "./img/watch.png",
    description: "Stylish smart watch with fitness tracking, notifications and multiple sports modes.",
    stock: 18,
    bestSeller: true,

    details: {
        type: "Smart Watch",
        display: "Touch Display",
        usage: "Fitness & Daily Use"
    },

    reviews: [
        {
            name: "Arun",
            rating: 5,
            comment: "Good display and battery life."
        },
        {
            name: "Kavya",
            rating: 4,
            comment: "Worth the price and easy to use."
        }
    ]
},

{
    id: 14,
    name: "Campus Women's Running Shoes",
    category: "Fashion",
    brand: "Campus",
    price: 999,
    rating: 4.4,
    image: "./img/shoes.png",
    description: "Comfortable and lightweight running shoes suitable for walking, running and daily wear.",
    stock: 15,
    bestSeller: false,

    details: {
        type: "Running Shoes",
        style: "Sports",
        usage: "Running & Casual"
    },

    reviews: [
        {
            name: "Priya",
            rating: 5,
            comment: "Very comfortable for daily walking."
        },
        {
            name: "Divya",
            rating: 4,
            comment: "Nice design and good quality."
        }
    ]
},

{
    id: 15,
    name: "boAt Airdopes Wireless Earbuds",
    category: "Electronics",
    brand: "boAt",
    price: 1299,
    rating: 4.6,
    image: "./img/earbuds.png",
    description: "Wireless earbuds with clear sound, touch controls and long-lasting battery backup.",
    stock: 25,
    bestSeller: true,

    details: {
        type: "Wireless Earbuds",
        connectivity: "Bluetooth",
        usage: "Music & Calls"
    },

    reviews: [
        {
            name: "Rahul",
            rating: 5,
            comment: "Sound quality is excellent for the price."
        },
        {
            name: "Nisha",
            rating: 4,
            comment: "Good battery backup and comfortable fit."
        }
    ]
},

{
    id: 16,
    name: "Maybelline Fit Me Foundation",
    category: "Beauty",
    brand: "Maybelline",
    price: 649,
    rating: 4.7,
    image: "./img/foundation.png",
    description: "Lightweight liquid foundation that provides natural-looking coverage for everyday makeup.",
    stock: 20,
    bestSeller: true,

    details: {
        type: "Liquid Foundation",
        finish: "Matte",
        usage: "Face Makeup"
    },

    reviews: [
        {
            name: "Shreya",
            rating: 5,
            comment: "Blends easily and gives a natural finish."
        },
        {
            name: "Meena",
            rating: 4,
            comment: "Good coverage and stays for a long time."
        }
    ]
},

{
    id: 17,
    name: "American Tourister Casual Backpack",
    category: "Fashion",
    brand: "American Tourister",
    price: 1199,
    rating: 4.6,
    image: "./img/backpack.png",
    description: "Spacious and durable backpack suitable for college, office and everyday travel.",
    stock: 10,
    bestSeller: false,

    // details: {
    //     type: "Backpack",
    //     style: "Casual",
    //     usage: "College & Travel"
    // },

    reviews: [
        {
            name: "Karthik",
            rating: 5,
            comment: "Spacious bag with very good quality."
        },
        {
            name: "Anu",
            rating: 4,
            comment: "Comfortable to carry and looks stylish."
        }
    ]
}
];