// Tracking Data
export const foodDatabase = [
  {
    id: 1,
    name: "Apple",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    serving: "1 medium",
  },
  {
    id: 2,
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving: "100g",
  },
  {
    id: 3,
    name: "Brown Rice",
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    serving: "1 cup cooked",
  },
  {
    id: 4,
    name: "Avocado",
    calories: 234,
    protein: 2.9,
    carbs: 12.5,
    fat: 21,
    serving: "1 medium",
  },
  {
    id: 5,
    name: "Greek Yogurt",
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    serving: "170g",
  },
  {
    id: 6,
    name: "Salmon",
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    serving: "100g",
  },
  {
    id: 7,
    name: "Spinach",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    serving: "100g",
  },
  {
    id: 8,
    name: "Banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    serving: "1 medium",
  },
  {
    id: 9,
    name: "Egg",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    serving: "1 large",
  },
  {
    id: 10,
    name: "Oatmeal",
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 2.5,
    serving: "1 cup cooked",
  },
];

export const exerciseDatabase = [
  { id: 1, name: "Running", caloriesPerMinute: 10, category: "Cardio" },
  { id: 2, name: "Cycling", caloriesPerMinute: 8, category: "Cardio" },
  { id: 3, name: "Swimming", caloriesPerMinute: 9, category: "Cardio" },
  {
    id: 4,
    name: "Weight Training",
    caloriesPerMinute: 6,
    category: "Strength",
  },
  { id: 5, name: "Yoga", caloriesPerMinute: 4, category: "Flexibility" },
  { id: 6, name: "HIIT", caloriesPerMinute: 12, category: "Cardio" },
  { id: 7, name: "Walking", caloriesPerMinute: 5, category: "Cardio" },
  { id: 8, name: "Pilates", caloriesPerMinute: 5, category: "Flexibility" },
  { id: 9, name: "Elliptical", caloriesPerMinute: 7, category: "Cardio" },
  { id: 10, name: "Stair Climbing", caloriesPerMinute: 9, category: "Cardio" },
];

// History Data
export const glucoseData = {
  current: 105,
  unit: "mg/dL",
  trend: "stable", // "rising", "falling", "stable", "rising_rapidly", "falling_rapidly"
  timeInRange: 75, // percentage
  timeBelowRange: 10, // percentage
  timeAboveRange: 15, // percentage
  variability: 18, // percentage
  gmi: 6.8, // percentage
  dailyReadings: [
    { time: "00:00", value: 110 },
    { time: "03:00", value: 95 },
    { time: "06:00", value: 100 },
    { time: "09:00", value: 120 },
    { time: "12:00", value: 115 },
    { time: "15:00", value: 105 },
    { time: "18:00", value: 110 },
    { time: "21:00", value: 105 },
  ],
  weeklyAverages: [
    { day: "Mon", value: 108 },
    { day: "Tue", value: 112 },
    { day: "Wed", value: 105 },
    { day: "Thu", value: 110 },
    { day: "Fri", value: 115 },
    { day: "Sat", value: 107 },
    { day: "Sun", value: 103 },
  ],
  monthlyAverages: [
    { week: "Week 1", value: 109 },
    { week: "Week 2", value: 107 },
    { week: "Week 3", value: 110 },
    { week: "Week 4", value: 105 },
  ],
};

// Enhanced food history with more data
export const foodHistory = [
  {
    date: "2025-05-13", // Today
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Oatmeal with Berries",
            calories: 250,
            protein: 8,
            carbs: 45,
            fat: 5,
            serving: "1 bowl",
          },
          {
            name: "Greek Yogurt",
            calories: 100,
            protein: 17,
            carbs: 6,
            fat: 0.4,
            serving: "170g",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Grilled Chicken Salad",
            calories: 350,
            protein: 30,
            carbs: 15,
            fat: 18,
            serving: "1 bowl",
          },
          {
            name: "Whole Grain Bread",
            calories: 120,
            protein: 4,
            carbs: 22,
            fat: 2,
            serving: "1 slice",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Salmon",
            calories: 206,
            protein: 22,
            carbs: 0,
            fat: 13,
            serving: "100g",
          },
          {
            name: "Brown Rice",
            calories: 215,
            protein: 5,
            carbs: 45,
            fat: 1.8,
            serving: "1 cup",
          },
          {
            name: "Steamed Broccoli",
            calories: 55,
            protein: 3.7,
            carbs: 11.2,
            fat: 0.6,
            serving: "1 cup",
          },
        ],
      },
      {
        type: "Snack",
        foods: [
          {
            name: "Apple",
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            serving: "1 medium",
          },
          {
            name: "Almonds",
            calories: 160,
            protein: 6,
            carbs: 6,
            fat: 14,
            serving: "1 oz",
          },
        ],
      },
    ],
    totalCalories: 1551,
    totalProtein: 96.2,
    totalCarbs: 175.2,
    totalFat: 55.1,
  },
  {
    date: "2025-05-14", // Yesterday
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Avocado Toast",
            calories: 320,
            protein: 10,
            carbs: 30,
            fat: 18,
            serving: "2 slices",
          },
          {
            name: "Scrambled Eggs",
            calories: 156,
            protein: 12.6,
            carbs: 1.2,
            fat: 10.6,
            serving: "2 eggs",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Quinoa Bowl",
            calories: 420,
            protein: 15,
            carbs: 65,
            fat: 12,
            serving: "1 bowl",
          },
          {
            name: "Mixed Berries",
            calories: 85,
            protein: 1.1,
            carbs: 21,
            fat: 0.5,
            serving: "1 cup",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Vegetable Stir Fry",
            calories: 280,
            protein: 12,
            carbs: 35,
            fat: 10,
            serving: "1 plate",
          },
          {
            name: "Tofu",
            calories: 180,
            protein: 20,
            carbs: 2,
            fat: 11,
            serving: "200g",
          },
        ],
      },
    ],
    totalCalories: 1441,
    totalProtein: 70.7,
    totalCarbs: 154.2,
    totalFat: 62.1,
  },
  {
    date: "2025-05-13", // 2 days ago
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Protein Smoothie",
            calories: 350,
            protein: 25,
            carbs: 40,
            fat: 10,
            serving: "1 glass",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Turkey Sandwich",
            calories: 380,
            protein: 25,
            carbs: 40,
            fat: 12,
            serving: "1 sandwich",
          },
          {
            name: "Mixed Greens Salad",
            calories: 70,
            protein: 2,
            carbs: 10,
            fat: 3,
            serving: "1 bowl",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Grilled Chicken",
            calories: 330,
            protein: 62,
            carbs: 0,
            fat: 7.2,
            serving: "200g",
          },
          {
            name: "Sweet Potato",
            calories: 180,
            protein: 4,
            carbs: 41,
            fat: 0.1,
            serving: "1 medium",
          },
          {
            name: "Asparagus",
            calories: 40,
            protein: 4.3,
            carbs: 7.4,
            fat: 0.4,
            serving: "1 cup",
          },
        ],
      },
    ],
    totalCalories: 1350,
    totalProtein: 122.3,
    totalCarbs: 138.4,
    totalFat: 32.7,
  },
  {
    date: "2025-05-12", // 3 days ago
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Banana Pancakes",
            calories: 420,
            protein: 12,
            carbs: 70,
            fat: 10,
            serving: "3 pancakes",
          },
          {
            name: "Maple Syrup",
            calories: 100,
            protein: 0,
            carbs: 26,
            fat: 0,
            serving: "2 tbsp",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Lentil Soup",
            calories: 230,
            protein: 15,
            carbs: 40,
            fat: 2,
            serving: "1 bowl",
          },
          {
            name: "Whole Grain Crackers",
            calories: 130,
            protein: 3,
            carbs: 22,
            fat: 4,
            serving: "10 crackers",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Beef Stir Fry",
            calories: 450,
            protein: 35,
            carbs: 30,
            fat: 20,
            serving: "1 plate",
          },
          {
            name: "Brown Rice",
            calories: 215,
            protein: 5,
            carbs: 45,
            fat: 1.8,
            serving: "1 cup",
          },
        ],
      },
      {
        type: "Snack",
        foods: [
          {
            name: "Dark Chocolate",
            calories: 170,
            protein: 2,
            carbs: 13,
            fat: 12,
            serving: "30g",
          },
        ],
      },
    ],
    totalCalories: 1715,
    totalProtein: 72,
    totalCarbs: 246,
    totalFat: 49.8,
  },
  {
    date: "2025-05-11", // 4 days ago
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Veggie Omelette",
            calories: 280,
            protein: 18,
            carbs: 6,
            fat: 20,
            serving: "3 eggs",
          },
          {
            name: "Whole Grain Toast",
            calories: 120,
            protein: 4,
            carbs: 22,
            fat: 2,
            serving: "1 slice",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Chicken Wrap",
            calories: 420,
            protein: 30,
            carbs: 45,
            fat: 14,
            serving: "1 wrap",
          },
          {
            name: "Greek Yogurt",
            calories: 100,
            protein: 17,
            carbs: 6,
            fat: 0.4,
            serving: "170g",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Grilled Salmon",
            calories: 412,
            protein: 44,
            carbs: 0,
            fat: 26,
            serving: "200g",
          },
          {
            name: "Quinoa",
            calories: 222,
            protein: 8,
            carbs: 39,
            fat: 3.6,
            serving: "1 cup",
          },
          {
            name: "Roasted Vegetables",
            calories: 120,
            protein: 4,
            carbs: 20,
            fat: 3,
            serving: "1 cup",
          },
        ],
      },
    ],
    totalCalories: 1674,
    totalProtein: 125,
    totalCarbs: 138,
    totalFat: 69,
  },
  {
    date: "2025-05-10", // 5 days ago
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Overnight Oats",
            calories: 350,
            protein: 15,
            carbs: 55,
            fat: 8,
            serving: "1 jar",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Mediterranean Salad",
            calories: 380,
            protein: 12,
            carbs: 25,
            fat: 28,
            serving: "1 bowl",
          },
          {
            name: "Hummus with Pita",
            calories: 250,
            protein: 8,
            carbs: 30,
            fat: 12,
            serving: "100g hummus, 1 pita",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Vegetable Pasta",
            calories: 420,
            protein: 15,
            carbs: 70,
            fat: 10,
            serving: "1 plate",
          },
          {
            name: "Garlic Bread",
            calories: 180,
            protein: 4,
            carbs: 24,
            fat: 8,
            serving: "2 slices",
          },
        ],
      },
      {
        type: "Snack",
        foods: [
          {
            name: "Mixed Nuts",
            calories: 170,
            protein: 5,
            carbs: 7,
            fat: 15,
            serving: "30g",
          },
        ],
      },
    ],
    totalCalories: 1750,
    totalProtein: 59,
    totalCarbs: 211,
    totalFat: 81,
  },
  {
    date: "2025-05-09", // 6 days ago
    meals: [
      {
        type: "Breakfast",
        foods: [
          {
            name: "Breakfast Burrito",
            calories: 450,
            protein: 20,
            carbs: 50,
            fat: 18,
            serving: "1 burrito",
          },
        ],
      },
      {
        type: "Lunch",
        foods: [
          {
            name: "Tuna Salad Sandwich",
            calories: 350,
            protein: 25,
            carbs: 35,
            fat: 12,
            serving: "1 sandwich",
          },
          {
            name: "Apple",
            calories: 95,
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            serving: "1 medium",
          },
        ],
      },
      {
        type: "Dinner",
        foods: [
          {
            name: "Chicken Curry",
            calories: 420,
            protein: 30,
            carbs: 25,
            fat: 22,
            serving: "1 serving",
          },
          {
            name: "Basmati Rice",
            calories: 200,
            protein: 4,
            carbs: 44,
            fat: 0.5,
            serving: "1 cup",
          },
        ],
      },
    ],
    totalCalories: 1515,
    totalProtein: 79.5,
    totalCarbs: 179,
    totalFat: 52.8,
  },
];

// Enhanced exercise history with more data
export const exerciseHistory = [
  {
    date: "2025-05-15", // Today
    activities: [
      { name: "Morning Run", duration: 30, caloriesBurned: 300, distance: 5 },
      { name: "Weight Training", duration: 45, caloriesBurned: 270 },
    ],
    totalDuration: 75,
    totalCaloriesBurned: 570,
  },
  {
    date: "2025-05-14", // Yesterday
    activities: [
      { name: "Yoga", duration: 60, caloriesBurned: 240 },
      { name: "Evening Walk", duration: 25, caloriesBurned: 125, distance: 2 },
    ],
    totalDuration: 85,
    totalCaloriesBurned: 365,
  },
  {
    date: "2025-05-13", // 2 days ago
    activities: [
      { name: "Cycling", duration: 45, caloriesBurned: 360, distance: 15 },
      { name: "HIIT Workout", duration: 20, caloriesBurned: 240 },
    ],
    totalDuration: 65,
    totalCaloriesBurned: 600,
  },
  {
    date: "2025-05-12", // 3 days ago
    activities: [{ name: "Swimming", duration: 40, caloriesBurned: 360 }],
    totalDuration: 40,
    totalCaloriesBurned: 360,
  },
  {
    date: "2025-05-11", // 4 days ago
    activities: [
      { name: "Strength Training", duration: 50, caloriesBurned: 300 },
      { name: "Stretching", duration: 15, caloriesBurned: 60 },
    ],
    totalDuration: 65,
    totalCaloriesBurned: 360,
  },
  {
    date: "2025-05-10", // 5 days ago
    activities: [
      { name: "Trail Running", duration: 35, caloriesBurned: 385, distance: 6 },
      { name: "Core Workout", duration: 20, caloriesBurned: 120 },
    ],
    totalDuration: 55,
    totalCaloriesBurned: 505,
  },
  {
    date: "2025-05-08", // 7 days ago
    activities: [
      { name: "Elliptical", duration: 30, caloriesBurned: 210 },
      { name: "Pilates", duration: 45, caloriesBurned: 225 },
    ],
    totalDuration: 75,
    totalCaloriesBurned: 435,
  },
  {
    date: "2025-05-06", // 9 days ago
    activities: [
      {
        name: "Mountain Biking",
        duration: 60,
        caloriesBurned: 540,
        distance: 18,
      },
    ],
    totalDuration: 60,
    totalCaloriesBurned: 540,
  },
  {
    date: "2025-05-05", // 10 days ago
    activities: [
      { name: "Boxing", duration: 45, caloriesBurned: 495 },
      {
        name: "Cooldown Walk",
        duration: 15,
        caloriesBurned: 75,
        distance: 1.5,
      },
    ],
    totalDuration: 60,
    totalCaloriesBurned: 570,
  },
  {
    date: "2025-05-03", // 12 days ago
    activities: [{ name: "Stair Climbing", duration: 25, caloriesBurned: 225 }],
    totalDuration: 25,
    totalCaloriesBurned: 225,
  },
];

// Community Data
export const communityGroups = [
  {
    id: 1,
    name: "San Francisco Runners",
    location: "San Francisco, CA",
    members: 128,
    description: "A group for running enthusiasts in the San Francisco area.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Bay Area Cyclists",
    location: "Bay Area, CA",
    members: 95,
    description:
      "Connect with fellow cyclists in the Bay Area for group rides and events.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "SF Yoga Community",
    location: "San Francisco, CA",
    members: 76,
    description: "Join fellow yoga practitioners for sessions and discussions.",
    image: "/placeholder.svg?height=100&width=100",
  },
];

export const emergencyContacts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Primary Care Physician",
    phone: "415-555-1234",
    email: "dr.johnson@example.com",
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "Emergency Contact",
    phone: "415-555-5678",
    email: "michael@example.com",
  },
  {
    id: 3,
    name: "City Hospital",
    role: "Hospital",
    phone: "415-555-9101",
    address: "123 Healthcare Ave, San Francisco, CA",
  },
];
