import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('live_chat_color')
export class LiveChatColor {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({ type: 'text', nullable: true })
    color!: string;

    @Column({ type: 'text', nullable: true })
    url!: string;

    //Người tạo
    @Column({ nullable: true })
    user_id!: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ nullable: true })
    created_at!: number;
}
