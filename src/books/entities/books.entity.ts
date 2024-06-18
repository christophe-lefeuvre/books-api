import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';

export enum Language {
    ENGLISH = 'en',
    FRENCH = 'fr',
}

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => Author, (author) => author.books)
    author: Author;

    @Column({ type: 'date' })
    publicationDate: Date;

    @Column()
    numberOfPages: number;

    @Column({ type: 'enum', enum: Language })
    language: Language;
}