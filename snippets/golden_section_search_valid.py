def find_alpha(X_train, y_train_oh, X_valid, y_valid_oh, y_valid, a, b, d, Je, criterion):
    # a and b: initial interval of uncertainty
    # d: desired final interval size
    # gr: golden ratio = (np.sqrt(5) - 1)/2
    # L (lambda): midpoint used by the algorithm
    # M (mi): midpoint used by the algorithm
    # criterior: accuracy or loss
    #----------------------------
    if criterion == 'accuracy':
        index = 1
    elif criterion == 'loss':
        index = 0
    else:
        raise ValueError("Criterion should be either 'accuracy' or 'loss'")
    #----------------------------
    gr = 0.618
    L = a + (1 - gr)*(b - a)
    M = a + gr*(b - a)
    J_lambda = Je(X_train, y_train_oh, X_valid, y_valid_oh, y_valid, alpha=L)[index]
    J_mi = Je(X_train, y_train_oh, X_valid, y_valid_oh, y_valid, alpha=M)[index]
    #----------------------------
    index_his = [J_lambda, J_mi]
    alpha_his = [L, M]
    #----------------------------
    while ( (abs(a-b)/2) >= d ):
        if (J_lambda > J_mi):
            a = L
            L = M
            M = a + gr*(b - a)
            J_lambda = J_mi
            J_mi = Je(X_train, y_train_oh, X_valid, y_valid_oh, y_valid, alpha=M)[index]
            index_his.append(J_mi)
            alpha_his.append(M)
        else:
            b = M
            M = L
            L = a + (1 - gr)*(b - a)
            J_mi = J_lambda
            J_lambda = Je(X_train, y_train_oh, X_valid, y_valid_oh, y_valid, alpha=L)[index]
            index_his.append(J_lambda)
            alpha_his.append(L)
    alpha = (a + b)/2
    return alpha, alpha_his, index_his
