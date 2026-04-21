import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Index
} from 'typeorm';

@Entity('messages')
export class LiveMessage {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔗 Conversation
  @Column({ name: 'conversation_id' })
  conversationId: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  // 👤 Agent gửi
  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  // 💬 nội dung
  @Column({ type: 'text', nullable: true })
  content: string;

  // 🔗 link
  @Column({ type: 'text', nullable: true })
  url: string;

  // 📎 file
  @Column({ type: 'text', nullable: true })
  file: string;

  // 👤 loại người gửi
  @Column({
    type: 'enum',
    enum: ['staff', 'customer', 'auto', 'ai'],
  })
  senderType: 'staff' | 'customer' | 'auto' | 'ai';

  // 👁 đã đọc chưa
  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  // 💻 client id
  @Column({ name: 'id_computer', nullable: true })
  idComputer: string;

  // 📊 tracking
  @Column({ nullable: true })
  gclid: string;

  // ⏱ thời gian
  @Column({ name: 'created_at' })
  createdAt: number;
}