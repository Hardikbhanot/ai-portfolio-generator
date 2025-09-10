package com.lopsie.portfolio.repository;

import com.lopsie.portfolio.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
