package com.helleyx.dashboard.controller;

import com.helleyx.dashboard.dto.*;
import com.helleyx.dashboard.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAll(
            @RequestParam(defaultValue = "all") String dateFilter) {
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getOrdersByDateFilter(dateFilter), "Orders fetched"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id), "Order fetched"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> create(@Valid @RequestBody OrderDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(orderService.createOrder(dto), "Order created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> update(
            @PathVariable Long id, @Valid @RequestBody OrderDTO dto) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateOrder(id, dto), "Order updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Order deleted"));
    }
}
