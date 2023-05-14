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

            double earthRadius = 6371; // kilometers average radius of the earth in km
            double latInRadians = Math.toRadians(centerLat);
            double lngInRadians = Math.toRadians(centerLng);

            double minLat = Math.toDegrees(latInRadians - radius / earthRadius);
            double maxLat = Math.toDegrees(latInRadians + radius / earthRadius);
            double minLng = Math.toDegrees(lngInRadians - radius / earthRadius / Math.cos(latInRadians));
            double maxLng = Math.toDegrees(lngInRadians + radius / earthRadius / Math.cos(latInRadians));

            if (minLat < -90) {
                minLat = -90;
            }
            if (maxLat > 90) {
                maxLat = 90;
            }
            if (minLng < -180) {
                minLng = -180;
            }
            if (maxLng > 180) {
                maxLng = 180;
            }

            Predicate latPredicate = criteriaBuilder.between(root.get("accommodation").get("xCoordinate"), minLat, maxLat);
            Predicate lngPredicate = criteriaBuilder.between(root.get("accommodation").get("yCoordinate"), minLng, maxLng);

            predicates.add(criteriaBuilder.and(latPredicate, lngPredicate));

//            //Calculate the distance
//            Expression<Double> latDiff = criteriaBuilder.diff(root.get("accommodation").get("xCoordinate"), centerLat);
//            Expression<Double> lngDiff = criteriaBuilder.diff(root.get("accommodation").get("yCoordinate"), centerLng);
//            Expression<Double> distance = criteriaBuilder.sqrt(criteriaBuilder.sum(criteriaBuilder.prod(latDiff, latDiff), criteriaBuilder.prod(lngDiff, lngDiff)));
//
//            // Add the distance check to the list of predicates
//            predicates.add(criteriaBuilder.le(distance, radius));
        }

        predicates.add(criteriaBuilder.equal(root.get("del"), false));
        predicates.add(criteriaBuilder.equal(root.get("approved"), true));
        predicates.add(criteriaBuilder.equal(root.get("notApproved"), false));

        return criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
    }
}
