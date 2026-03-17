package com.helleyx.dashboard.dto;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class WidgetDTO {
    private Long id;
    private Long layoutId;
    private String widgetType;
    private String title;
    private String description;
    private String settingsJson;
    private Integer width;
    private Integer height;
    private Integer xPosition;
    private Integer yPosition;
}
