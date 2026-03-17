package com.helleyx.dashboard.service;

import com.helleyx.dashboard.dto.DashboardLayoutDTO;
import com.helleyx.dashboard.dto.WidgetDTO;
import com.helleyx.dashboard.entity.*;
import com.helleyx.dashboard.exception.ResourceNotFoundException;
import com.helleyx.dashboard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final DashboardLayoutRepository layoutRepo;
    private final WidgetRepository widgetRepo;

    @Transactional
    public DashboardLayoutDTO getLayout(String userId) {
        DashboardLayout layout = layoutRepo.findFirstByUserIdOrderByUpdatedAtDesc(userId)
                .orElseGet(() -> layoutRepo.save(
                        DashboardLayout.builder().userId(userId).layoutJson("[]").build()));
        return toDTO(layout);
    }

    @Transactional
    public DashboardLayoutDTO saveLayout(String userId, DashboardLayoutDTO dto) {
        DashboardLayout layout = layoutRepo.findFirstByUserIdOrderByUpdatedAtDesc(userId)
                .orElseGet(() -> DashboardLayout.builder().userId(userId).build());
        layout.setLayoutJson(dto.getLayoutJson());
        DashboardLayout saved = layoutRepo.save(layout);

        if (dto.getWidgets() != null) {
            widgetRepo.deleteByDashboardLayoutId(saved.getId());
            List<Widget> widgets = dto.getWidgets().stream()
                    .map(w -> toWidgetEntity(w, saved)).collect(Collectors.toList());
            widgetRepo.saveAll(widgets);
        }
        return toDTO(layoutRepo.findById(saved.getId()).orElse(saved));
    }

    @Transactional
    public WidgetDTO addWidget(String userId, WidgetDTO dto) {
        DashboardLayout layout = layoutRepo.findFirstByUserIdOrderByUpdatedAtDesc(userId)
                .orElseGet(() -> layoutRepo.save(
                        DashboardLayout.builder().userId(userId).layoutJson("[]").build()));
        return toWidgetDTO(widgetRepo.save(toWidgetEntity(dto, layout)));
    }

    @Transactional
    public WidgetDTO updateWidget(Long widgetId, WidgetDTO dto) {
        Widget w = widgetRepo.findById(widgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Widget not found: " + widgetId));
        w.setTitle(dto.getTitle()); w.setDescription(dto.getDescription());
        w.setSettingsJson(dto.getSettingsJson());
        w.setWidth(dto.getWidth());   w.setHeight(dto.getHeight());
        w.setXPosition(dto.getXPosition()); w.setYPosition(dto.getYPosition());
        return toWidgetDTO(widgetRepo.save(w));
    }

    @Transactional
    public void deleteWidget(Long widgetId) {
        if (!widgetRepo.existsById(widgetId))
            throw new ResourceNotFoundException("Widget not found: " + widgetId);
        widgetRepo.deleteById(widgetId);
    }

    // ── Mappers ──────────────────────────────────────────────────────────────
    private DashboardLayoutDTO toDTO(DashboardLayout l) {
        List<WidgetDTO> widgets = widgetRepo.findByDashboardLayoutId(l.getId())
                .stream().map(this::toWidgetDTO).collect(Collectors.toList());
        return DashboardLayoutDTO.builder()
                .id(l.getId()).userId(l.getUserId()).layoutJson(l.getLayoutJson())
                .createdAt(l.getCreatedAt()).updatedAt(l.getUpdatedAt()).widgets(widgets).build();
    }

    private Widget toWidgetEntity(WidgetDTO dto, DashboardLayout layout) {
        return Widget.builder()
                .dashboardLayout(layout)
                .widgetType(dto.getWidgetType()).title(dto.getTitle())
                .description(dto.getDescription()).settingsJson(dto.getSettingsJson())
                .width(dto.getWidth()      != null ? dto.getWidth()      : 4)
                .height(dto.getHeight()    != null ? dto.getHeight()     : 2)
                .xPosition(dto.getXPosition() != null ? dto.getXPosition() : 0)
                .yPosition(dto.getYPosition() != null ? dto.getYPosition() : 0)
                .build();
    }

    private WidgetDTO toWidgetDTO(Widget w) {
        return WidgetDTO.builder()
                .id(w.getId()).layoutId(w.getDashboardLayout().getId())
                .widgetType(w.getWidgetType()).title(w.getTitle()).description(w.getDescription())
                .settingsJson(w.getSettingsJson()).width(w.getWidth()).height(w.getHeight())
                .xPosition(w.getXPosition()).yPosition(w.getYPosition()).build();
    }
}
