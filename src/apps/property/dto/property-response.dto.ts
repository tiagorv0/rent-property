export class PropertyResponseDto {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  registration: string;
  registrationValue: number;
  boughtAt: Date;
  marketValue: number | null;
  squareMeters: number | null;
}
