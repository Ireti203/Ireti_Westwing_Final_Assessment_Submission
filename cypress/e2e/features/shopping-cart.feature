@shopping-cart @e2e
Feature: Shopping Cart Functionality
  As a customer of Westwing Now
  I want to add products from different categories to my shopping cart
  So that I can purchase multiple items

  Background:
    Given I am on the Westwing Now website

  @moebel @furniture
  Scenario: Add product from Möbel category to cart
    Given I navigate to the "moebel" product category
    When I select a random product from the category
    And I add the product to my cart
    Then the product should be visible in my cart
    And the cart icon should display a count of "1"

  @wohnaccessoires @accessories
  Scenario: Add product from Wohnaccessoires category to cart
    Given I navigate to the "wohnaccessoires" product category
    When I select a random product from the category
    And I add the product to my cart
    Then the product should be visible in my cart
    And the cart icon should display a count of "1"

  @leuchten @lighting
  Scenario: Add product from Leuchten category to cart
    Given I navigate to the "leuchten" product category
    When I select a random product from the category
    And I add the product to my cart
    Then the product should be visible in my cart
    And the cart icon should display a count of "1"

  @multiple-categories @comprehensive
  Scenario Outline: Add products from multiple categories to cart
    Given I navigate to the "<category>" product category
    When I select a random product from the category
    And I add the product to my cart
    Then the product should be visible in my cart
    And the cart icon should display the updated count

    Examples:
      | category          |
      | moebel            |
      | wohnaccessoires   |
      | leuchten          |
