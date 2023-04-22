package com.nvl.motelbackend.repository;

import com.nvl.motelbackend.entity.Post;
import com.nvl.motelbackend.model.SearchDTO;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class PostSpecification implements Specification<Post> {

    private SearchDTO searchRequest;

    public PostSpecification(SearchDTO searchRequest) {
        this.searchRequest = searchRequest;
    }

    @Override
    public Predicate toPredicate(Root<Post> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        if (searchRequest.getMinPrice() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("accommodation").get("price"), searchRequest.getMinPrice()));
        }
        if (searchRequest.getMaxPrice() != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("accommodation").get("price"), searchRequest.getMaxPrice()));
        }

        if(searchRequest.getCategoryId() != null) {
            predicates.add(criteriaBuilder.equal(root.get("accommodation").get("category").get("id"), searchRequest.getCategoryId()));
        }

        if(searchRequest.getAddress() != null) {
            predicates.add(criteriaBuilder.like(root.get("accommodation").get("address"), "%"+searchRequest.getAddress()+"%"));
        }

        if(searchRequest.getMinAcreage() != null) {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("accommodation").get("acreage"), searchRequest.getMinAcreage()));
        }
        if(searchRequest.getMaxAcreage() != null) {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("accommodation").get("acreage"), searchRequest.getMaxAcreage()));
        }

        if (searchRequest.getRadius() != null && searchRequest.getXCoordinate() != null && searchRequest.getYCoordinate() != null) {
            double radius = searchRequest.getRadius();
            double centerLat = searchRequest.getXCoordinate();
            double centerLng = searchRequest.getYCoordinate();

            //Calculate the distance
            Expression<Double> latDiff = criteriaBuilder.diff(root.get("accommodation").get("xCoordinate"), centerLat);
            Expression<Double> lngDiff = criteriaBuilder.diff(root.get("accommodation").get("yCoordinate"), centerLng);
            Expression<Double> distance = criteriaBuilder.sqrt(criteriaBuilder.sum(criteriaBuilder.prod(latDiff, latDiff), criteriaBuilder.prod(lngDiff, lngDiff)));

            // Add the distance check to the list of predicates
            predicates.add(criteriaBuilder.le(distance, radius));
        }

        return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
    }
}
