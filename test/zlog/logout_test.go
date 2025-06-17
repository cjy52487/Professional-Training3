package zlog

import (
	"go.uber.org/zap"
	"kama_chat_server/pkg/zlog"
	"testing"
)

func TestInfo(t *testing.T) {
	zlog.Info("this is a info", zap.String("name", "apylee"))
}
