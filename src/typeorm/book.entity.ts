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
    name: string;

    @Column({
        name: 'author',
        nullable: false,
        default: '',
    })
    author: string;

    @Column({
        nullable: false,
        default: '',
    })
    isbn: string;
}
