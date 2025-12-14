import React from 'react';
import '../styles/SweetCard.css';

const SweetCard = ({ sweet, onPurchase, isAdmin, onRestock, onDelete }) => {
    const isOutOfStock = sweet.quantity <= 0;

    return (
        <div className="sweet-card glass-panel animate-float">
            <div className="card-image">
                <div className="category-tag">{sweet.category}</div>

                <img
                    src={sweet.image || getSweetImage(sweet.category)}
                    alt={sweet.name}
                    onError={(e) => { e.target.src = getSweetImage(sweet.category); }}
                />
            </div>

            <div className="card-content">
                <h3>{sweet.name}</h3>
                <div className="card-details">
                    <span className="price">₹{sweet.price}</span>
                    <span className={`stock ${isOutOfStock ? 'out' : ''}`}>
                        {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} left`}
                    </span>
                </div>

                <button
                    className="purchase-btn hover-glow"
                    disabled={isOutOfStock}
                    onClick={() => onPurchase(sweet._id)}
                >
                    {isOutOfStock ? 'Sold Out' : 'Purchase'}
                </button>

                {isAdmin && (
                    <div className="admin-controls" style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                        <button
                            onClick={() => onRestock(sweet._id)}
                            style={{ flex: 1, background: "#4CAF50", border: "none", padding: "8px", borderRadius: "8px", color: "white", cursor: "pointer" }}
                        >
                            + Restock
                        </button>
                        <button
                            onClick={() => onDelete(sweet._id)}
                            style={{ flex: 1, background: "#f44336", border: "none", padding: "8px", borderRadius: "8px", color: "white", cursor: "pointer" }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const getSweetImage = (category) => {
    const keyword = category.toLowerCase().includes('donut') ? 'donut' : 'candy';
    return `https://source.unsplash.com/400x300/?${keyword},sweet,space`;
};

export default SweetCard;
