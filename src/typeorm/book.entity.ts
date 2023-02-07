import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Books {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'bid',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    title: string;

    @Column({
        nullable: true,
        default: '',
    })
    subtitle: string;

    @Column({
        name: 'authors',
        nullable: false,
        default: '',
    })
    authors: string;

    @Column({
        nullable: true,
        default: '',
    })
    publisher: string;

    @Column({
        nullable: true,
        default: '',
    })
    published_date: string;

    @Column({
        nullable: true,
        default: '',
    })
    description: string;

    @Column({
        name: 'page_count',
        nullable: true,
    })
    page_count: number;

    @Column({
        nullable: false,
        default: '',
    })
    thumbnail: string;

    @Column({
        name: 'categories',
        nullable: false,
        default: '',
    })
    categories: string;

    @Column({
        nullable: false,
        default: '',
    })
    isbn_13: string;

    @Column({
        nullable: false,
        default: '',
    })
    isbn_10: string;
}
