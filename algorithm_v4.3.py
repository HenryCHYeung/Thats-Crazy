import json

def read_component_data():
    # Read the component data from the JSON file
    with open('components_v3.1.json', 'r') as file:
        component_data = json.load(file)
    return component_data

def get_user_input():
    while True:
        user_usage = input("Choose 1 for Gaming or 2 for Production: ")
        if user_usage not in ['1', '2']:
            print("Invalid choice. Please choose 1 for Gaming or 2 for Production.")
        else:
            user_usage = int(user_usage)
            break

    while True:
        if user_usage == 1:
            print("Choose your budget for Gaming:")
            print("1 = $800, 2 = $1000, 3 = $1300, 4 = $1500, 5 = $2000")
            user_budget_choice = input("Enter the number corresponding to your budget: ")
        elif user_usage == 2:
            print("Choose your budget for Production:")
            print("1 = $1300, 2 = $1500, 3 = $1700, 4 = $2000, 5 = $2500, 6 = $3000, 7 = $3500")
            user_budget_choice = input("Enter the number corresponding to your budget: ")

        if user_budget_choice in ['1', '2', '3', '4', '5', '6', '7']:
            user_budget = {
                '1': 800.0, '2': 1000.0, '3': 1300.0, '4': 1500.0, '5': 2000.0,
                '6': 2500.0, '7': 3000.0, '8': 3500.0
            }[user_budget_choice]
            break
        else:
            print("Invalid choice. Please select a valid budget option.")

    return user_usage, user_budget


def recommend_components(component_data, purpose, user_budget):
    components = component_data[purpose]

    # Determine the budget tier based on the user's budget
    budget_tier = "LowEnd" if (purpose == "Gaming" and user_budget <= 1000) or (purpose == "Production" and user_budget <= 1500) else "HighEnd"
    
    recommendations = {}
    min_components, sum_of_min_cost = find_min_components(component_data, purpose, user_budget)
    #print(min_components)
    #print(sum_of_min_cost)
    total_cost = 0

    for component_type in ["CPUs", "GPUs", "RAM", "Storage", "PSU", "Case", "Motherboard"]:
        #print(min_components.get(component_type).get("price"))
        sum_of_min_others = sum_of_min_cost - min_components.get(component_type).get("price")
        affordable_components = [
            component
            for component in components["LowEnd"][component_type]
            if component.get("price", 0) <= (user_budget - sum_of_min_others)
        ]
        #print("sum of min others: ", sum_of_min_others)
        #print("Budget - sum: ", user_budget - sum_of_min_others)

        if not affordable_components:
            raise ValueError("Sorry, we couldn't find compatible components within your budget.")

        sorted_components = sorted(
            affordable_components,
            key=lambda x: x.get("performance_score", 0),
            reverse=True,
        )

        selected_component = sorted_components[0]
        recommendations[component_type] = selected_component
        total_cost += selected_component["price"]
        sum_of_min_cost = sum_of_min_others + selected_component["price"]

    return recommendations


def find_min_components(component_data, purpose, user_budget):

    components = component_data[purpose]
    min_components = {}
    total_cost = 0

    for component_type in ["CPUs", "GPUs", "RAM", "Storage", "PSU", "Case", "Motherboard"]:
        affordable_components = [
            component
            for component in components["LowEnd"][component_type]
            if component.get("price", 0) <= user_budget
        ]

        if not affordable_components:
            raise ValueError("Sorry, we couldn't find compatible components within your budget.")

        sorted_components = sorted(
            affordable_components,
            key=lambda x: x.get("price", 0),
            reverse=False
        )

        selected_component = sorted_components[0]
        min_components[component_type] = selected_component
        total_cost += selected_component["price"]

    return min_components, total_cost


def main():
    print("Welcome to PC Builder!")

    while True:
        user_usage, user_budget = get_user_input()
        component_data = read_component_data()
        purpose = "Gaming" if user_usage == 1 else "Production"

        try:
            recommendations = recommend_components(component_data, purpose, user_budget)
        except ValueError as e:
            print(str(e))
            continue

        #print(recommendations)

        print("\nRecommended Components:")
        total_cost = 0

        for component_type, component in recommendations.items():
            print(f"Recommended {component_type}: {component['name']}, Price: ${component['price']:.2f}")
            total_cost += component['price']

        # Round the total cost to the nearest cent
        total_cost = round(total_cost, 2)

        print(f"Total Cost (Including Case and Motherboard): ${total_cost:.2f}")

        # Ask the user whether they want the PC to be built or not
        build_option = input("Do you want this PC to be built for an additional $100 plus shipping (y/n)? ").lower()

        if build_option == "y":
            print("Thank you for choosing to have your PC built for you!")
            break
        elif build_option == "n":
            print("Thank you for choosing to build your PC yourself!")
            break
        else:
            print("Invalid choice. Please enter 'y' for 'Yes' or 'n' for 'No'.")

if __name__ == "__main__":
    main()
