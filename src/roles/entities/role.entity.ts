import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Role {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ nullable: true })
    name: string;



    @Column({ nullable: true })
    create_at: string;
}
