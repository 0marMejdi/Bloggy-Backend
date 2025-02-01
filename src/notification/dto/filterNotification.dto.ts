export class filterNotificationDto {
  filter: {
    //_id: any;
    senderId: any;
    receiverId?: any;
    reservationId: any;
    is_read?: any;
  };
  role:string;
  pageNumber: number;
  pageSize: number;
  sortField: any;
  sortOrder: any;
}
