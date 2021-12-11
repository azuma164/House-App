from gensim.models import word2vec
w2v = word2vec.Word2Vec(review_list, size=200, window=10, hs=0, min_count=5, sg=1)
from sklearn.manifold import TSNE
import numpy as np
tsne = TSNE(n_components=2, random_state=0)
np.set_printoptions(suppress=True)
tsne.fit_transform(vec) 

word_list = w2v.wv.index2word[:plot_count]
plt.figure(figsize=(20,20))#図のサイズ
plt.scatter(tsne.embedding_[:plot_count, 0], tsne.embedding_[:plot_count, 1])
count = 0
for label, x, y in zip(word_list, tsne.embedding_[:, 0], tsne.embedding_[:, 1]):
    count +=1
    plt.annotate(label, xy=(x, y), xytext=(0, 0), textcoords='offset points')
    if(count>=limit):
        break