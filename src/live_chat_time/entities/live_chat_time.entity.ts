import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('live_chat_time')
export class LiveChatTime {
    @PrimaryGeneratedColumn("increment")
    id!: number;
    
    @Column({  nullable: true, default: 3 })
    time!: number;

    //thời gian tạo
    @Column({ nullable: true })
    created_at!: number;
}
