export class CreatePostDto {
    species: string;
    breed?: string;
    location: string;
    passphrase: string;
    contactName?: string;
    contactNumber: number;
    status: string;
    info: string;
    image?: string;
}