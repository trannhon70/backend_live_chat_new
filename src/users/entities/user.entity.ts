import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    online: string;

    @Column({ nullable: true, default: false })
    status: Boolean;

    @Column({ nullable: true })
    create_at: string;
}