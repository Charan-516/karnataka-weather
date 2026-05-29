export interface City {
    name: string
    lat: number
    lng: number
    region: string
}

export const CITIES: City[] = [
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, region: 'South' },
    { name: 'Mysuru', lat: 12.2958, lng: 76.6394, region: 'South' },
    { name: 'Tumakuru', lat: 13.3379, lng: 77.1173, region: 'South' },
    { name: 'Hassan', lat: 13.0013, lng: 76.2310, region: 'South' },
    { name: 'Mandya', lat: 12.5218, lng: 76.8951, region: 'South' },
    { name: 'Chikkamagaluru', lat: 13.3161, lng: 75.7720, region: 'Malnad' },
    { name: 'Shivamogga', lat: 13.9316, lng: 75.5677, region: 'Malnad' },
    { name: 'Kodagu', lat: 12.3375, lng: 75.8069, region: 'Malnad' },
    { name: 'Davanagere', lat: 14.4644, lng: 75.9208, region: 'Central' },
    { name: 'Chitradurga', lat: 14.2257, lng: 76.3998, region: 'Central' },
    { name: 'Ballari', lat: 15.1394, lng: 76.9214, region: 'Hyderabad-KA' },
    { name: 'Hubli', lat: 15.3647, lng: 75.1240, region: 'North' },
    { name: 'Dharwad', lat: 15.4589, lng: 75.0078, region: 'North' },
    { name: 'Belagavi', lat: 15.8523, lng: 74.4977, region: 'North' },
    { name: 'Gadag', lat: 15.4315, lng: 75.6251, region: 'North' },
    { name: 'Vijayapura', lat: 16.7050, lng: 75.7339, region: 'North' },
    { name: 'Kalaburagi', lat: 17.3297, lng: 76.8343, region: 'Hyderabad-KA' },
    { name: 'Bidar', lat: 17.9104, lng: 77.5199, region: 'Hyderabad-KA' },
    { name: 'Raichur', lat: 16.2011, lng: 77.3498, region: 'Hyderabad-KA' },
    { name: 'Mangaluru', lat: 12.9141, lng: 74.8560, region: 'Coastal' },
    { name: 'Udupi', lat: 13.3409, lng: 74.7421, region: 'Coastal' },
]

export function toScene(lat: number, lng: number) {
    return {
        x: (lng - 76.3) * 1.8,
        y: (lat - 14.9) * 1.8,
    }
}