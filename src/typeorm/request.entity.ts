import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Book } from 'src/typeorm/book.entity';

@Entity()
export class Request {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'rid',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    email: string;

    @CreateDateColumn()
    created_on: Date;

    // add fk column explicitly here
    @Column({ name: 'isbn_ten' })
    isbn_ten: string;

    @ManyToOne(() => Book, (book) => book.requests, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "isbn_ten" })
    book: Book
}

