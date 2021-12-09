import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
class T_SNE:
  def __init__(self, dfs):
    self.dfs = dfs
  def execute(self):
    transformed =  TSNE(n_components=2,perplexity=10, random_state=0).fit_transform(self.dfs) #可視化結果を左右するパラメータ
    plt.figure(figsize=(6, 6))
    plt.scatter(transformed[0:49, 0], transformed[0:49, 1], c="b", alpha=0.5, label="setosa") 
    plt.scatter(transformed[50:99, 0], transformed[50:99, 1], c="r", alpha=0.5, label="virginica") 
    plt.scatter(transformed[100:149, 0], transformed[100:149, 1], c="g", alpha=0.5, label="versicolor")
    plt.legend()
    plt.title("TSNE")
    plt.grid()
    plt.show()