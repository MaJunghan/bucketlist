import { BucketListItem } from 'src/bucket-list-items/entities/bucket-lists.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  location: string;

  @OneToMany(
    () => BucketListItem,
    (bucketListItem) => bucketListItem.destination,
  )
  bucketListItems: BucketListItem[];
}
