import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Chapter } from 'src/typeorm/chapter.entity';

@Entity()
export class Book {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'bid',
    })
    id: number;

    @PrimaryColumn({
        nullable: false,
        default: '',
    })
    isbn_ten: string;

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


    @OneToMany(type => Chapter, chapter => chapter.book, {
        cascade: true
    })
    isbn_10: string;
}
