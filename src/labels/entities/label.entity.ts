import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('labels')
export class Label {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    name!: string;

    @Column({ nullable: true })
    color!: string;

    //Người tạo
    @Column({ nullable: true })
    user_id!: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ nullable: true })
    created_at!: number;
}
