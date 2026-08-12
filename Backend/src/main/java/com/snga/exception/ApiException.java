package com.snga.exception;

import org.springframework.http.HttpStatus;

/**
 * Application-level exception that carries an HTTP status code and a
 * human-readable message.  Caught and serialised by
 * {@link GlobalExceptionHandler}.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
