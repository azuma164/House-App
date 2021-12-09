import  matplotlib.pyplot as plt
from sklearn import manifold #MDSのライブラリimport
class MDS:
  def __init__(self, dfs):
    self.dfs = dfs
  def execute(self):
    clf = manifold.MDS(n_components=2, n_init=1, max_iter=100,random_state=0)#分離結果を左右する乱数とハイパーパラメータ
    X_mds = clf.fit_transform(self.dfs)
    plt.figure(figsize=(6, 6))
    plt.scatter(X_mds[0:49, 0], X_mds[0:49, 1], c="b", alpha=0.5, label="setosa") 
    plt.scatter(X_mds[50:99, 0], X_mds[50:99, 1], c="r", alpha=0.5, label="virginica") 
    plt.scatter(X_mds[100:149, 0], X_mds[100:149, 1], c="g", alpha=0.5, label="versicolor")
    plt.legend()
    plt.title("MDS")
    plt.grid()
    plt.show()