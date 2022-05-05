// Kiểm tra va chạm giữa hình tròn và chữ nhật (tham khảo)
// Vòng tròn có tọa độ { R: bán kính, X: X, Y: Y }
// rect { X: X, Y: Y, W: Width, H: Height }
function CircleRectangleCollision(circle, rect) {
    // kiểm tra chuyển động chạm góc
    // Corner trên - trái
    if (circle.X + circle.R < rect.X && circle.Y + circle.R < rect.Y) {
        if (Magnitude({X: circle.X, Y: circle.Y}, {X: rect.X, Y: rect.Y}) <= circle.R) {
            return true;
        } else {
            return false;
        }
    }
    // Corner trên - phải
    if (circle.X > rect.X + rect.W && circle.Y < rect.Y) {
        if (Magnitude({X: circle.X, Y: circle.Y}, {X: rect.X + rect.W, Y: rect.Y}) <= circle.R) {
            return true;
        } else {
            return false;
        }
    }
    // Corner dưới phải
    if (circle.X > rect.X + rect.W && circle.Y > rect.Y + rect.H) {
        if (Magnitude({X: circle.X, Y: circle.Y}, {X: rect.X + rect.W, Y: rect.Y + rect.H}) <= circle.R) {
            return true;
        } else {
            return false;
        }
    }
    // Corner dưới trái
    if (circle.X < rect.X && circle.Y > rect.Y + rect.H) {
        if (Magnitude({X: circle.X, Y: circle.Y}, {X: rect.X, Y: rect.Y + rect.H}) <= circle.R) {
            return true;
        } else {
            return false;
        }
    }

    // test va chạm hình chữ nhật
    if (circle.X + circle.R > rect.X && circle.Y + circle.R > rect.Y &&
        circle.X - circle.R < rect.X + rect.W && circle.Y - circle.R < rect.Y + rect.H) {
        return true;
    }
    //
    return false;
}