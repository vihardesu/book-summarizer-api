import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from 'src/typeorm/book.entity';

@Entity()
export class Summary {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'sid',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    contents: string;

    @Column({
        name: 'tokens',
        nullable: false,
    })
    tokens: number;

    @Column({
        nullable: false,
        default: '',
    })
    summary_type: string;

    // add fk column explicitly here
    @Column({ name: 'isbn_ten' })
    isbn_ten: string;

    @ManyToOne(() => Book, (book) => book.summaries, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "isbn_ten" })
    book: Book
}
