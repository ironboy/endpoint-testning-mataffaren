Feature: Category list
  As a REST-api endpoint consumer I want to be able to get a list of all categories in the shop.

  Background:
    Given that I am on the domain "http://localhost:4000"

  Scenario: Get a list of all categories
    When I visit the endpoint "GET" "/api/leftMenu/categorytree"
    Then the status code of the response should be 200
    And the response time should be below 1000 milliseconds
    And there should be at least 10 main categories

  Scenario Outline: Visiting a main category
    When I visit the endpoint "GET" "/api/c/{categoryUrlPart}?size=30&page=0&sort=topRated"
    Then the status code of the response should be 200
    And the response time should be below 1000 milliseconds
    And there should be at least 1 product in the category

    # Use dynamic data (from previous scenario)
    Examples:
      | {dynamic: 'categoryUrlParts'} |
