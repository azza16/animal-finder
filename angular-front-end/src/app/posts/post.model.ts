export class Post {
    _id: string;
    species: string;
    breed: string;
    location: string;
    passphrase?: string;
    contactName?: string;
    contactNumber: number;
    status: string;
    info: string;
    image?: string;
    date?: Date;
    approved: boolean;
}