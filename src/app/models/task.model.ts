export enum TaskStatus {
  Pending = 'Pending',
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed'
}

export enum DataType {
  Users = 'users',
  Posts = 'posts',
  Photos = 'photos'
}

export interface PhotoRecord {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface CollectionTask {
  id: string;
  name: string;
  dataType: DataType;
  amount: number;
  interval: number;
  status: TaskStatus;
  collected: PhotoRecord[];
  createdAt: Date;
}

export interface ActivityLogEntry {
  timestamp: Date;
  taskId: string;
  message: string;
}
