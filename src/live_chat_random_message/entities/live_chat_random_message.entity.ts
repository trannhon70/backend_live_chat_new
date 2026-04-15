import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('live_chat_random_message')
export class LiveChatRandomMessage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: true })
    name!: string;

    @Column({  nullable: true })
    color!: string;

    //Người tạo
    @Column({ nullable: true })
    user_id!: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user!: User;
    
    @Column({  nullable: true, default: 5 })
    time!: number;

    //thời gian tạo
    @Column({ nullable: true })
    created_at!: number;
}
