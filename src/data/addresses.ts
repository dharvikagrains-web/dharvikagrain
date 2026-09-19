import { SavedAddress } from '@/types';

export const initialAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    type: 'Home',
    isDefault: true,
    fullName: 'Pavan Geesala',
    mobile: '+91 98765 43210',
    houseFlat: 'Flat 402, Sri Nilayam',
    streetArea: 'Madhapur Main Road, Hitec City',
    landmark: 'Opposite Cyber Towers',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
  },
  {
    id: 'addr-2',
    type: 'Work',
    isDefault: false,
    fullName: 'Pavan Geesala',
    mobile: '+91 98765 43210',
    houseFlat: 'Floor 3, Innovation Labs',
    streetArea: 'Financial District, Gachibowli',
    landmark: 'Near WaveRock SEZ',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
  },
];
