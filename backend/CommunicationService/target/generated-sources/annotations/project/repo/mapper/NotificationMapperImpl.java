package project.repo.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import project.repo.dtos.NotificationDTO;
import project.repo.entity.Notification;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-26T05:50:18+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.16 (Oracle Corporation)"
)
@Component
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public Notification toEntity(NotificationDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Notification.NotificationBuilder notification = Notification.builder();

        notification.id( dto.getId() );
        notification.userId( dto.getUserId() );
        notification.title( dto.getTitle() );
        notification.message( dto.getMessage() );
        if ( dto.getType() != null ) {
            notification.type( Enum.valueOf( Notification.NotificationType.class, dto.getType() ) );
        }
        notification.referenceId( dto.getReferenceId() );
        notification.isRead( dto.getIsRead() );
        if ( dto.getChannel() != null ) {
            notification.channel( Enum.valueOf( Notification.Channel.class, dto.getChannel() ) );
        }
        notification.createdAt( dto.getCreatedAt() );
        notification.readAt( dto.getReadAt() );

        return notification.build();
    }

    @Override
    public NotificationDTO toDto(Notification entity) {
        if ( entity == null ) {
            return null;
        }

        NotificationDTO.NotificationDTOBuilder notificationDTO = NotificationDTO.builder();

        notificationDTO.id( entity.getId() );
        notificationDTO.userId( entity.getUserId() );
        notificationDTO.title( entity.getTitle() );
        notificationDTO.message( entity.getMessage() );
        if ( entity.getType() != null ) {
            notificationDTO.type( entity.getType().name() );
        }
        if ( entity.getChannel() != null ) {
            notificationDTO.channel( entity.getChannel().name() );
        }
        notificationDTO.referenceId( entity.getReferenceId() );
        notificationDTO.isRead( entity.getIsRead() );
        notificationDTO.createdAt( entity.getCreatedAt() );
        notificationDTO.readAt( entity.getReadAt() );

        return notificationDTO.build();
    }
}
