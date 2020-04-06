def find_alpha(x, y, K, folds, a, b, d, Je):
    # a and b: initial interval of uncertainty
    # d: desired final interval size
    # gr: golden ratio = (np.sqrt(5) - 1)/2
    # L (lambda): midpoint used by the algorithm
    # M (mi): midpoint used by the algorithm
    gr = 0.618
    L = a + (1 - gr)*(b - a)
    M = a + gr*(b - a)
    J_lambda = Je(x, y, K, folds, alpha=L)[1]
    J_mi = Je(x, y, K, folds, alpha=M)[1]
    while ( (abs(a-b)/2) >= d ):
        if (J_lambda > J_mi):
            a = L
            L = M
            M = a + gr*(b - a)
            J_lambda = J_mi
            J_mi = Je(x, y, K, folds, alpha=M)[1]
        else:
            b = M
            M = L
            L = a + (1 - gr)*(b - a)
            J_mi = J_lambda
            J_lambda = Je(x, y, K, folds, alpha=L)[1]
    alpha = (a + b)/2
    return alpha
