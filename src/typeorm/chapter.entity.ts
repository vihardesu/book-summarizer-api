import { Column, Entity, PrimaryGeneratedColumn, Unique, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Book } from 'src/typeorm/book.entity';
import { ChapterSummary } from 'src/typeorm/chapter_summary.entity';

@Unique('unique_chapters', ['isbn_ten', 'sequence_index'])
@Entity()
export class Chapter {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'cid',
    })
    id: number;

    @Column({
        nullable: true,
        default: '',
    })
    part: string;

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

    // add relationship to chapter summaries
    @OneToMany(type => ChapterSummary, chapter_summary => chapter_summary.chapter, {
        cascade: true
    })
    chapter_summaries: ChapterSummary[];
}
