import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing vehicle data...');
    await prisma.vehicle.deleteMany({});

    console.log('Seeding vehicles...');

    const vehicles = [
        {
            make: 'Tata',
            model: 'Safari Dark Edition',
            year: 2024,
            price: 2750000,
            mileage: 0,
            fuelType: 'Diesel',
            transmission: 'Automatic',
            color: 'Oberon Black',
            stock: 5,
            description: 'The all-new Tata Safari Dark Edition with premium interior finishes, advanced ADAS, and ventilated seats.',
            imageUrl: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'AVAILABLE'
        },
        {
            make: 'Mahindra',
            model: 'XUV700 AX7',
            year: 2024,
            price: 2680000,
            mileage: 1500,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            color: 'Midnight Black',
            stock: 2,
            description: 'Feature-rich SUV with panoramic sunroof, dual 10.25-inch screens and powerful mStallion engine.',
            imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'AVAILABLE'
        },
        {
            make: 'Hyundai',
            model: 'Creta N Line',
            year: 2024,
            price: 2050000,
            mileage: 0,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            color: 'Thunder Blue',
            stock: 8,
            description: 'Sporty compact SUV with WRC-inspired design cues, stiffer suspension, and dual exhaust.',
            imageUrl: 'https://images.unsplash.com/photo-1629897048514-3dd7414df9fc?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'AVAILABLE'
        },
        {
            make: 'Kia',
            model: 'Seltos X-Line',
            year: 2024,
            price: 2035000,
            mileage: 50,
            fuelType: 'Diesel',
            transmission: 'Automatic',
            color: 'Matte Graphite',
            stock: 0,
            description: 'Premium compact SUV with HUD, Bose sound system, and matte finish. Next shipment arriving soon.',
            imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'IN_TRANSIT'
        },
        {
            make: 'Honda',
            model: 'City ZX',
            year: 2023,
            price: 1650000,
            mileage: 12000,
            fuelType: 'Petrol',
            transmission: 'Manual',
            color: 'Radiant Red',
            stock: 3,
            description: 'Elegant sedan with spacious cabin, lane watch camera, and reliable i-VTEC engine.',
            imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop',
            category: 'Sedan',
            status: 'AVAILABLE'
        },
        {
            make: 'Toyota',
            model: 'Innova Hycross',
            year: 2024,
            price: 3100000,
            mileage: 0,
            fuelType: 'Hybrid',
            transmission: 'Automatic',
            color: 'Super White',
            stock: 1,
            description: 'Premium MPV offering fantastic fuel efficiency, captain seats, and Toyota reliability.',
            imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop',
            category: 'MPV',
            status: 'AVAILABLE'
        },
        {
            make: 'Maruti Suzuki',
            model: 'Swift ZXi+',
            year: 2023,
            price: 900000,
            mileage: 8000,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            color: 'Solid Fire Red',
            stock: 6,
            description: 'Sporty hatchback, fun to drive, low maintenance, featuring the new advanced infotainment system.',
            imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
            category: 'Hatchback',
            status: 'AVAILABLE'
        },
        {
            make: 'Volkswagen',
            model: 'Virtus GT',
            year: 2024,
            price: 1950000,
            mileage: 200,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            color: 'Wild Cherry Red',
            stock: 4,
            description: 'Performance sedan with 1.5L TSI EVO engine, DSG gearbox, and impressive driving dynamics.',
            imageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop',
            category: 'Sedan',
            status: 'AVAILABLE'
        },
        {
            make: 'Skoda',
            model: 'Kushaq Monte Carlo',
            year: 2024,
            price: 2000000,
            mileage: 0,
            fuelType: 'Petrol',
            transmission: 'Manual',
            color: 'Tornado Red',
            stock: 2,
            description: 'Distinctive styling with black styling cues, virtual cockpit, and 1.5L TSI engine for thrill seekers.',
            imageUrl: 'https://images.unsplash.com/photo-1553440569-bfc1015e5c56?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'AVAILABLE'
        },
        {
            make: 'MG',
            model: 'Hector Plus',
            year: 2023,
            price: 2200000,
            mileage: 18000,
            fuelType: 'Diesel',
            transmission: 'Manual',
            color: 'Glaze Red',
            stock: 3,
            description: 'Feature-heavy 6-seater SUV showing off internet connectivity and massive panoramic sunroof.',
            imageUrl: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'AVAILABLE'
        },
        {
            make: 'Jeep',
            model: 'Compass Model S',
            year: 2024,
            price: 3200000,
            mileage: 0,
            fuelType: 'Diesel',
            transmission: 'Automatic',
            color: 'Techno Metallic Green',
            stock: 1,
            description: 'Robust 4x4 capable premium SUV setting the benchmark for off-roading in this segment.',
            imageUrl: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1fd?q=80&w=800&auto=format&fit=crop',
            category: 'SUV',
            status: 'AVAILABLE'
        }
    ];

    for (const v of vehicles) {
        await prisma.vehicle.create({
            data: v
        });
    }

    console.log(`Successfully seeded ${vehicles.length} vehicles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
