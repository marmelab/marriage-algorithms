# Stable marriage algorithms

## Description

This package implements two algorithms:
- the [**Gale-Shapley**](https://en.wikipedia.org/wiki/Gale%E2%80%93Shapley_algorithm) algorithm that solves [stable marriage problems](https://en.wikipedia.org/wiki/Stable_marriage_problem)
- the **Roth-Shapley** algorithm, also known as deferred acceptance algorithm, 
which solves the Hospitals-Residents problem (*i.e.* stable marriage problems with 
capacities)

#### Examples:
**Man-Woman stable marriage problem**

As explained [here](https://en.wikipedia.org/wiki/Stable_marriage_problem) a stable marriage problem is the following:
"Given n men and n women, where each person has ranked all members of the opposite sex in order of preference, marry the men and women together such that there are no two people of opposite sex who would both rather have each other than their current partners. When there are no such pairs of people, the set of marriages is deemed stable."

For example, let us consider four men: Albert, Bob, Charles and Denis, and four women: Alice, Brigitte, Diane and Emily.

Each man, respectively woman, has its own preference. For instance:

| Man   | Preferences (preferred first) |
|-----  |-------------------------------|
|Albert | Alice, Brigitte, Diane, Emily|
|Bob    | Alice, Emily, Diane, Brigitte|
|Charles| Brigitte, Alice, Diane, Emily|
|Denis  | Emily, Brigitte, Diane, Alice|

| Woman  | Preferences (preferred first) |
|-----   |-------------------------------|
|Alice   | Denis, Charles, Albert, Bob|
|Brigitte| Bob, Denis, Albert, Charles|
|Diane   | Denis, Albert, Bob, Charles|
|Emily   | Charles, Bob, Albert, Denis|

A naive solution could consist in satisfying women first. For instance we can marry Alice with Denis, Brigitte with Bob, Diane with Albert (2nd choice), and Emily with Charles.
This solution can be represented by the following matrix:

| Woman  | Preferences (preferred first) |
|-----   |-------------------------------|
|Alice   | **Denis**, ~~Charles~~, ~~Albert~~, ~~Bob~~|
|Brigitte| **Bob**, ~~Denis~~, ~~Albert~~, ~~Charles~~|
|Diane   | ~~Denis~~, **Albert**, ~~Bob~~, ~~Charles~~|
|Emily   | **Charles**, ~~Bob~~, ~~Albert~~, ~~Denis~~|

 Man   | Preferences (preferred first) |
|-----  |-------------------------------|
|Albert | ~~Alice~~, ~~Brigitte~~, **Diane**, ~~Emily~~|
|Bob    | ~~Alice~~, ~~Emily~~, ~~Diane~~, **Brigitte**|
|Charles| ~~Brigitte~~, ~~Alice~~, ~~Diane~~, **Emily**|
|Denis  | ~~Emily~~, ~~Brigitte~~, ~~Diane~~, **Alice**|

But is this solution a *stable marriage*?

Unfortunately, this is not a stable solution to the initial problem.
Let us consider Diane and Denis for instance. They would both be happier if we marry them together (Diane prefers Denis to Albert, and Denis prefers Diane to Alice).

The **Gale-Shapley** algorithm computes a solution which is stable:

 Man   | Preferences (preferred first) |
|-----  |-------------------------------|
|Albert | ~~Alice~~, ~~Brigitte~~, **Diane**, ~~Emily~~|
|Bob    | ~~Alice~~, **Emily**, ~~Diane~~, ~~Brigitte~~|
|Charles| ~~Brigitte~~, **Alice**, ~~Diane~~, ~~Emily~~|
|Denis  | ~~Emily~~, **Brigitte**, ~~Diane~~, ~~Alice~~|

| Woman  | Preferences (preferred first) |
|-----   |-------------------------------|
|Alice   | ~~Denis~~, **Charles**, ~~Albert~~, ~~Bob~~|
|Brigitte| ~~Bob~~, **Denis**, ~~Albert~~, ~~Charles~~|
|Diane   | ~~Denis~~, **Albert**, ~~Bob~~, ~~Charles~~|
|Emily   | ~~Charles~~, **Bob**, ~~Albert~~, ~~Denis~~|

No one has its first choice but this 'marriage' is said stable because you cannot find two players who would prefer to be married together.

**Hospitals-Residents problem**

The Hospitals-Residents problem, also known as the College-Admission problem, is a variation of the previous one where we want to assign graduating medical students (called residents) to hospitals. Each hospital has a positive capacity.
Both Residents and Hospitals have an ordered list of preferences.

Suppose that we have 3 hospitals (called Hospital-0, Hospital-1, and Hospital-2) with respective capacities 3, 3 and 4.
Suppose we have 10 residents (whose names are Resident-0, Resident-1, ..., Resident-9)
which have to be assigned to an hospital. 
Each Resident prefers Hospital-0 first, and then Hospital-1 over Hospital-2, but each Hospital prefers residents as following: Resident-9, Resident-8, etc.

To find a stable matching assignment we have two possibilities:
- we can transform the current Hospitals-Residents problem into a stable marriage problem (i.e. a problem where the number of participants of each side is equal). 
 A simple approach consists in creating as many hospitals as needed to simulate capacities.\
 For example, to simulate Hospital-0 which has a capacity of 3, we can create 3 participants: Hospital-0_0, Hospital-0_1, and Hospital-0_2 (where each one has a capacity equals to 1). 
 Following this approach for Hospital-1 and Hospital-2 we are back to a classical stable marriage problem and the Gale-shapley can be used to find a solution.

- another possibility consists in modifying the Gale-Shapley algorithm to handle capacities during the resolution. This new algorithm is called Roth-Shapley algorithm, and isa bit more efficient, for this kind of problem, than the previous Gale-Shapley algorithm.

#### Data structure
In this library we consider two main data-stuctures: `Player` and `Registry`.

A `Player` is a partner in a marriage problem
(*i.e.* a Male or a Female in a 'classical' marriage problem, a Resident or an Hospital in a Hospitals-Residents allocation problem, a Student or a School in a School choice problem):
* a `Player` has a name
* a `Player` has a maximal capacity: 1 in a 'classical' single-partner marriage problem, but it can be greater for a School which has a fixed capacity for instance
* a `Player` should also have a strictly ordered list of preferences (called `candidates`). `rankTable` is an auxiliary table used to speedup the algorithms: given a candidate's name, the table gives the position of this candidate in the list of preferences

In addition to this data-structure, the `Player` modules offers several functions such as create a player, add a candidate in a list of preferences, remove a candidate from a list of preferences, retrieve the preferred candidate, etc.

For efficiency reasons a `Player` is a mutable data-structure. In particular, `candidates` and `rankTable` are modified when a candidate is added or removed from a list of preferences.

A `Registry` is a data-structure which stores the list of partners to which a given `Player` is associated.
This is simply implemented by an object (*i.e.* a map) whose keys are players' name.

The module offers functions to engage a player with another one, to disengage a player, to know if a player is fully engaged (according to its capacity), to know the worst partner of a player with whom it is engaged, etc.

#### Algorithms



## References

- [Nice tutorial](http://www.ams.org/publicoutreach/feature-column/fc-2015-03)
- [Implementations](https://github.com/daffidwilde/matching) in Python of 
Gale-Shapley and Roth-Shapley (Resident-Hospital) algorithms
- [Rosetta code](https://rosettacode.org/wiki/Stable_marriage_problem#JavaScript)
- [Hospital algorithm](https://arxiv.org/pdf/1408.2969.pdf)
- Several implementations of [Stable marriage problem](https://github.com/alextanhongpin/stable-marriage-problem)
- [Matching tools API](https://matchingtools.com/)
- Simple [Deferred acceptance algorithm](https://gist.github.com/scribu/104ec4ba54207db8c6e8) in Python
- [Complexity analysis](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&cad=rja&uact=8&ved=2ahUKEwjzjZbj9tThAhVxZN8KHRW7Da0QFjACegQIBxAC&url=https%3A%2F%2Fwww.researchgate.net%2Fprofile%2FMohamed_Mourad_Lafifi%2Fpost%2FHow_can_the_issues_of_satisfiability_and_fairness_in_matching_problems_be_answered_int_he_environment_of_dynamic_resource_allocation_and_computing%2Fattachment%2F59d6554979197b80779ac858%2FAS%253A525137776132096%25401502214010799%2Fdownload%2FComplexity%2Band%2Balgorithms%2Bin%2Bmatching%2Bproblems%2Bunder%2Bpreferences%2BCseh_Agnes.pdf&usg=AOvVaw0e7n4KwJYH03Bsve7yOd0v)
