import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Chapter } from 'src/typeorm/chapter.entity';

@Entity()
export class ChapterSummary {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'csid',
    })
    id: number;

    @Column({
        nullable: false,
        default: '',
    })
    clean_chapter_name: string;

    @Column({
        nullable: false,
        default: '',
    })
    isbn_ten: string;

    @PrimaryColumn({
        nullable: false,
        default: '',
    })
    summary_type: string;

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
    @PrimaryColumn({ name: 'cid' })
    cid: string;

    @ManyToOne(() => Chapter, (chapter) => chapter.chapter_summaries, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "cid" })
    chapter: Chapter
}
