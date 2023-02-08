import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from 'src/typeorm/book.entity';

@Entity()
export class Chapter {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'cid',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    name: string;

    @Column({
        name: 'sequence_index',
        nullable: false,
    })
    sequence_index: number;

    @Column({
        nullable: false,
        default: '',
    })
    contents: string;

    // add fk column explicitly here
    @Column({ name: 'isbn_ten' })
    isbn_ten: string;

    @ManyToOne(() => Book, (book) => book.chapters, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "isbn_ten" })
    book: Book
}
