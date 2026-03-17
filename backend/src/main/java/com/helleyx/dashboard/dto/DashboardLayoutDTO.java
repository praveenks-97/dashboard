package com.helleyx.dashboard.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardLayoutDTO {
    private Long id;
    private String userId;
    private String layoutJson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<WidgetDTO> widgets;
}
