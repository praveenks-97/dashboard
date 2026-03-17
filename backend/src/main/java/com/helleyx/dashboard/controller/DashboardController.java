package com.helleyx.dashboard.controller;

import com.helleyx.dashboard.dto.*;
import com.helleyx.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<DashboardLayoutDTO>> getLayout(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.getLayout(userId), "Dashboard fetched"));
    }

    @PostMapping("/{userId}/save")
    public ResponseEntity<ApiResponse<DashboardLayoutDTO>> saveLayout(
            @PathVariable String userId, @RequestBody DashboardLayoutDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.saveLayout(userId, dto), "Dashboard saved"));
    }

    @PostMapping("/{userId}/widgets")
    public ResponseEntity<ApiResponse<WidgetDTO>> addWidget(
            @PathVariable String userId, @RequestBody WidgetDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dashboardService.addWidget(userId, dto), "Widget added"));
    }

    @PutMapping("/widgets/{widgetId}")
    public ResponseEntity<ApiResponse<WidgetDTO>> updateWidget(
            @PathVariable Long widgetId, @RequestBody WidgetDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(
                dashboardService.updateWidget(widgetId, dto), "Widget updated"));
    }

    @DeleteMapping("/widgets/{widgetId}")
    public ResponseEntity<ApiResponse<Void>> deleteWidget(@PathVariable Long widgetId) {
        dashboardService.deleteWidget(widgetId);
        return ResponseEntity.ok(ApiResponse.success(null, "Widget deleted"));
    }
}
