package com.helleyx.dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "widgets")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Widget {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "layout_id", nullable = false)
    @ToString.Exclude @EqualsAndHashCode.Exclude
    private DashboardLayout dashboardLayout;

    @Column(name = "widget_type", nullable = false, length = 50)  private String widgetType;
    @Column(name = "title",       nullable = false, length = 255) private String title;
    @Column(name = "description", length = 500)                   private String description;
    @Column(name = "settings_json", columnDefinition = "LONGTEXT") private String settingsJson;

    @Column(name = "width",      nullable = false) private Integer width;
    @Column(name = "height",     nullable = false) private Integer height;
    @Column(name = "x_position", nullable = false) private Integer xPosition;
    @Column(name = "y_position", nullable = false) private Integer yPosition;
}
